import ts from 'typescript';
import path from 'node:path';

const expansionPath =
  /^curriculum\/genshin-action-expansion(?:-[a-z0-9-]+)?\.mjs$/;
const expansionName = /^genshinActionExpansion[A-Za-z0-9]*$/;
const dataNames = new Map([
  ['curriculum/ruby-notes.mjs', 'RUBY_NOTES'],
  ['curriculum/audio-prosody.mjs', 'AUDIO_PROSODY'],
  ['curriculum/genshin-supplement.mjs', 'genshinSupplement'],
  ['curriculum/genshin-quote-sources.mjs', 'genshinQuoteSources'],
  ['curriculum/genshin-action-coverage.mjs', 'genshinActionCoverage'],
  ['curriculum/game-character-questions.mjs', 'gameMeaningDistractors'],
  ['lib/vocab-illustrations.mjs', 'VOCAB_ILLUSTRATIONS'],
]);
const mixedModules = new Set([
  'curriculum/game-character-study.mjs',
  'curriculum/game-character-questions.mjs',
]);

/** Build/type directives are executable inputs. @param {string} text */
function directives(text) {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.Standard,
    text,
  );
  const found = [];
  for (
    let kind = scanner.scan();
    kind !== ts.SyntaxKind.EndOfFileToken;
    kind = scanner.scan()
  ) {
    if (
      [
        ts.SyntaxKind.SingleLineCommentTrivia,
        ts.SyntaxKind.MultiLineCommentTrivia,
      ].includes(kind) &&
      /@vite-|webpack|[@#]__PURE__|@ts-|@jsx|sourceMappingURL|sourceURL/i.test(
        scanner.getTokenText(),
      )
    )
      found.push(scanner.getTokenText());
  }
  return JSON.stringify(found);
}

/** No calls, getters, spreads or executable expressions. @param {ts.Node} node @returns {boolean} */
export function isLiteralData(node) {
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return true;
  if (
    [
      ts.SyntaxKind.TrueKeyword,
      ts.SyntaxKind.FalseKeyword,
      ts.SyntaxKind.NullKeyword,
    ].includes(node.kind)
  )
    return true;
  if (ts.isPrefixUnaryExpression(node))
    return (
      [ts.SyntaxKind.PlusToken, ts.SyntaxKind.MinusToken].includes(
        node.operator,
      ) && ts.isNumericLiteral(node.operand)
    );
  if (ts.isArrayLiteralExpression(node))
    return node.elements.every(isLiteralData);
  if (ts.isObjectLiteralExpression(node))
    return node.properties.every(
      (property) =>
        ts.isPropertyAssignment(property) &&
        (ts.isIdentifier(property.name) ||
          ts.isStringLiteral(property.name) ||
          ts.isNumericLiteral(property.name)) &&
        !['__proto__', 'prototype', 'constructor'].includes(
          property.name.text,
        ) &&
        isLiteralData(property.initializer),
    );
  return false;
}

/** @param {string} file @param {string} text @returns {ts.SourceFile} */
function parse(file, text) {
  const source =
    /** @type {ts.SourceFile & {parseDiagnostics: readonly ts.Diagnostic[]}} */ (
      ts.createSourceFile(
        file,
        text,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.JS,
      )
    );
  if (source.parseDiagnostics.length) throw new Error('Invalid content syntax');
  return source;
}

/** A new expansion is a literal const. @param {string} file @param {string} text */
export function expansionExport(file, text) {
  const source = parse(file, text);
  if (source.statements.length !== 1)
    throw new Error('Expansion must contain one declaration');
  const statement = source.statements[0];
  if (
    !ts.isVariableStatement(statement) ||
    !statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ||
    !(statement.declarationList.flags & ts.NodeFlags.Const) ||
    statement.declarationList.declarations.length !== 1
  )
    throw new Error('Invalid expansion declaration');
  const declaration = statement.declarationList.declarations[0];
  if (
    !ts.isIdentifier(declaration.name) ||
    !expansionName.test(declaration.name.text) ||
    !declaration.initializer ||
    !ts.isArrayLiteralExpression(declaration.initializer) ||
    !isLiteralData(declaration.initializer)
  )
    throw new Error('Expansion is not literal data');
  return declaration.name.text;
}

/**
 * Mask only validated data; retain and compare all executable structure.
 * Controlled expansion imports/lists are data wiring, but imported modules must
 * themselves be literal exports. A loader, mapping function or guard change is full.
 * @param {string} file
 * @param {string} text
 * @param {(file: string) => string | null} read
 */
export function executableShape(file, text, read) {
  const source = parse(file, text);
  const bindings = new Set();
  const imports = new Set();
  if (mixedModules.has(file))
    for (const statement of source.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        !ts.isStringLiteral(statement.moduleSpecifier)
      )
        continue;
      const target = path.posix.normalize(
        path.posix.join(
          path.posix.dirname(file),
          statement.moduleSpecifier.text,
        ),
      );
      if (!expansionPath.test(target)) continue;
      const clause = statement.importClause;
      if (
        !clause ||
        clause.isTypeOnly ||
        clause.name ||
        !clause.namedBindings ||
        !ts.isNamedImports(clause.namedBindings) ||
        clause.namedBindings.elements.length !== 1
      )
        throw new Error('Invalid expansion import');
      const binding = clause.namedBindings.elements[0];
      const imported = read(target);
      if (
        binding.propertyName ||
        !expansionName.test(binding.name.text) ||
        imported === null ||
        expansionExport(target, imported) !== binding.name.text
      )
        throw new Error('Unverified expansion import');
      bindings.add(binding.name.text);
      imports.add(statement);
    }
  let masked = 0;
  const expected = dataNames.get(file);
  const result = ts.transform(source, [
    (context) => {
      /** @type {ts.Visitor} */
      const visit = (node) => {
        if (imports.has(node)) return undefined;
        if (
          expected &&
          ts.isVariableDeclaration(node) &&
          ts.isIdentifier(node.name) &&
          node.name.text === expected
        ) {
          if (!node.initializer || !isLiteralData(node.initializer))
            throw new Error('Nonliteral data initializer');
          masked++;
          return ts.factory.updateVariableDeclaration(
            node,
            node.name,
            node.exclamationToken,
            node.type,
            ts.factory.createIdentifier('CI_LITERAL_CONTENT'),
          );
        }
        if (
          bindings.size &&
          ts.isArrayLiteralExpression(node) &&
          node.elements.length &&
          node.elements.every(
            (element) =>
              ts.isSpreadElement(element) &&
              ts.isIdentifier(element.expression) &&
              bindings.has(element.expression.text),
          )
        )
          return ts.factory.createIdentifier('CI_EXPANSION_INPUTS');
        return ts.visitEachChild(node, visit, context);
      };
      return (root) => /** @type {ts.SourceFile} */ (ts.visitNode(root, visit));
    },
  ]);
  try {
    if (expected && masked !== 1)
      throw new Error('Missing/duplicate data declaration');
    return ts
      .createPrinter({ removeComments: true })
      .printFile(result.transformed[0]);
  } finally {
    result.dispose();
  }
}

/** @param {string} file */
export function isDocument(file) {
  return (
    ['README.md', 'AGENTS.md', 'progress.md'].includes(file) ||
    /^docs\/.+\.md$/.test(file)
  );
}

/** @param {string} file */
function isContentTest(file) {
  return (
    /^tests\/(?:genshin-[a-z0-9-]+|game-study|game-portraits|vocab-artwork-revision|vocab-illustrations|vocab-illustration-inventory|ruby-notes|audio-prosody)\.test\.mjs$/.test(
      file,
    ) ||
    /^tests\/helpers\/before-(?:[a-z0-9-]+-)?action-expansion\.mjs$/.test(file)
  );
}

/**
 * Paths include both ends of renames. Unsupported statuses/paths/parse errors
 * fail closed to full; unit tests are still all executed in the content profile.
 * @param {{status: string, paths: string[]}[]} changes
 * @param {(version: 'base' | 'head', file: string) => string | null} read
 */
export function classifyChanges(changes, read) {
  let content = false;
  let tests = false;
  const reasons = [];
  const paths = [...new Set(changes.flatMap((change) => change.paths))];
  if (!paths.length)
    return { profile: 'full', paths, reasons: ['No comparable changes'] };
  for (const change of changes) {
    if (!/^(?:[AMD]|[RC]\d+)$/.test(change.status))
      return { profile: 'full', paths, reasons: ['Unsupported change status'] };
    for (const file of change.paths) {
      if (
        file.includes('\\') ||
        path.posix.isAbsolute(file) ||
        file.split('/').includes('..')
      )
        return { profile: 'full', paths, reasons: ['Invalid change path'] };
      if (isDocument(file)) continue;
      if (isContentTest(file)) {
        tests = true;
        continue;
      }
      try {
        if (
          /^public\/(?:audio\/.+\.mp3|images\/vocab\/[^/]+\.svg)$/.test(file)
        ) {
          content = true;
          continue;
        }
        // Public README is a served artifact, so it still needs a content build/deploy.
        if (file === 'public/images/vocab/README.md') {
          content = true;
          continue;
        }
        const before = read('base', file),
          after = read('head', file);
        if (file === 'docs/vocab-illustration-descriptions.json') {
          for (const text of [before, after])
            if (text !== null) {
              const data = JSON.parse(text);
              if (
                !data ||
                Array.isArray(data) ||
                typeof data !== 'object' ||
                !Object.values(data).every((v) => typeof v === 'string')
              )
                throw new Error('Invalid description data');
            }
        } else if (expansionPath.test(file)) {
          for (const text of [before, after])
            if (text !== null) expansionExport(file, text);
        } else if (dataNames.has(file) || mixedModules.has(file)) {
          if (
            before === null ||
            after === null ||
            directives(before) !== directives(after) ||
            executableShape(file, before, (p) => read('base', p)) !==
              executableShape(file, after, (p) => read('head', p))
          )
            throw new Error('Executable structure changed');
        } else
          return {
            profile: 'full',
            paths,
            reasons: [`Unclassified path: ${file}`],
          };
        if (before === null && after === null)
          throw new Error('Missing compared file');
        content = true;
      } catch {
        return {
          profile: 'full',
          paths,
          reasons: [`Unverified content structure: ${file}`],
        };
      }
    }
  }
  if (tests && !content)
    reasons.push('Test-only change requires full validation');
  return {
    profile: tests && !content ? 'full' : content ? 'content' : 'docs',
    paths,
    reasons,
  };
}

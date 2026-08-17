/**
 * Minimal Svelte/TS highlighter for the docs code panels.
 *
 * Deliberately not a real parser and deliberately not a dependency: it tags
 * comments, strings, tags, Svelte blocks and directives in one pass. One pass
 * matters — running several regexes in sequence would start matching inside the
 * `<span>`s inserted by the previous one and corrupt the output.
 */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

export function escapeHtml(source: string): string {
  return source.replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

const PATTERN = new RegExp(
  [
    '(&lt;!--[\\s\\S]*?--&gt;|/\\*[\\s\\S]*?\\*/|//[^\\n]*)', // 1 comments
    '(&quot;[\\s\\S]*?&quot;|&#39;[\\s\\S]*?&#39;|`[\\s\\S]*?`)', // 2 strings
    '(&lt;/?[A-Za-z][\\w.:-]*)', // 3 tags
    '(\\{[#:/@][a-z]+)', // 4 svelte blocks
    '\\b(use|bind|transition|in|out|animate|class):([\\w.-]+)', // 5,6 directives
    '\\b(const|let|function|return|import|from|export|if|else|await|async|as|new|type|interface)\\b' // 7 keywords
  ].join('|'),
  'g'
);

export function highlight(source: string): string {
  return escapeHtml(source).replace(
    PATTERN,
    (match, comment, string, tag, block, directive, directiveName, keyword) => {
      if (comment) return `<span class="tok-comment">${comment}</span>`;
      if (string) return `<span class="tok-string">${string}</span>`;
      if (tag) return `<span class="tok-tag">${tag}</span>`;
      if (block) return `<span class="tok-block">${block}</span>`;
      if (directive) return `<span class="tok-directive">${directive}:</span>${directiveName}`;
      if (keyword) return `<span class="tok-keyword">${keyword}</span>`;
      return match;
    }
  );
}

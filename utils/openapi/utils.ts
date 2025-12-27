const THUNK_EXTRACT_RE = /.+=>(.+)/
// biome-ignore lint/complexity/noBannedTypes: Function type needed for thunk extraction
export function extractNameFromThunk(thunk: Function): string | undefined {
	const res = THUNK_EXTRACT_RE.exec(thunk.toString())
	if (!res || res.length < 2) return
	return res[1]
}

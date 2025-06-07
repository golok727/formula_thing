export type SrcSpan = {
	start: number;
	end: number;
};

export function span(start: number, end: number): SrcSpan {
	return { start, end };
}

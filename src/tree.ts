
export type Node = { nodes: { [name: string]: Node }, leaves: string[], path: string[] }
export function build(segmentsList: string[][]): Node {
    const res: Node = { nodes: {}, leaves: [], path: [] }
    for (let segments of segmentsList) {
        let level = res
        const path = []
        const tail = segments.pop()
        for (let segment of segments) {
            path.push(segment)
            if (!level.nodes[segment]) {
                level.nodes[segment] = { nodes: {}, leaves: [], path: [...path] }
            }
            level = level.nodes[segment]
        }
        level.leaves.push(tail)
    }
    return res
}
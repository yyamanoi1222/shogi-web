export type Side = 'white' | 'black'

export const switchSide = ({ current }: { current: Side }): Side => {
  return current === 'white' ? 'black' : 'white'
}

export const playerInit = (): Side => {
  const sides: Side[] = ['white', 'black']
  return sides.sort(() => Math.random() - 0.5)[0]
}

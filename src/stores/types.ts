export interface Component {
  type: string
  x: number
  y: number
  props: Record<string, any>
  styles: Record<string, any>
  events: Record<string, any>
}

export interface CanvasStyle {
  width: string
  height: string
  margin: string
  backgroundColor: string
  border: string
  boxShadow: string
}

export interface Project {
  id: string
  name: string
  components: Component[]
  createdAt: string
  updatedAt: string
  viewType: 'pc' | 'mobile'
  canvasStyle: CanvasStyle
}
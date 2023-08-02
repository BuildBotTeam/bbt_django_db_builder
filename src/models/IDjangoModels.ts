export type Point = {
    x: number
    y: number
    width: number
    height: number
}

export type ConnectionItem = {
    class_name: string
    field_name: string
    pos: Point
    dif_y: number
}

export type ConnectionType = {
    id: string
    from: ConnectionItem
    to: ConnectionItem
}

export type DjangoClassType = {
    class_name: string
    pos: Point
    meta?: ClassMetaType
    color: string
}

export const ClassFieldTypeList = ['ForeignField', 'CharField', 'TextField', 'ForeignKey']

export type ClassFieldsType = {
    id: number
    parent_class_name: string
    type: 'ForeignField' | 'CharField' | 'TextField' | 'ForeignKey'
    field_name: string
    related_name?: string
    dif_y?: number
    class_name?: string
    key_id?: number
    field_id?: number
    max_length?: number
    on_delete?: string
    verbose_name?: string
    blank?: boolean
    tnull?: boolean
}

export type ClassMetaType = {
    ordering?: string
}
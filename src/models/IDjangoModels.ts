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
}

export const ClassFieldTypeList = ['ForeignField', 'CharField', 'TextField', 'ForeignKey']

export type ClassFieldsType = {
    parent_class_name: string
    type: 'ForeignField' | 'CharField' | 'TextField' | 'ForeignKey'
    field_name: string
    related_name?: string
    dif_y?: number
    class_name?: string
    max_length?: number
    on_delete?: string
    verbose_name?: string
    blank?: boolean
    tnull?: boolean
}

export type FieldKeyType = {
    parent_class_name: string
    key_name: string
    dif_y?: number
}

export type ClassMetaType = {
    ordering?: string
}
export type Point = {
    x: number
    y: number
}

export type ConnectionType = {
    from: {class_name: string, field_name: string}
    to: {class_name: string, field_name: string}
}

export type DjangoClassType = {
    class_name: string
    pos: Point
    meta?: ClassMetaType
    fields: ClassFieldsType[]
}

export type ClassFieldsType = {
    type: 'ForeignField' | 'CharField' | 'TextField' | 'ForeignKey'
    field_name: string
    pos?: Point
    class_name?: string
    max_length?: number
    on_delete?: string
    verbose_name?: string
    blank?: boolean
    tnull?: boolean
}

export type ClassMetaType = {
    ordering?: string
}
import React from "react";

export type Point = {
    x: number
    y: number
}

export type ConnectionType = {
    from: string
    to: string
}

export type DjangoClassType = {
    class_name: string
    pos: Point
    meta?: ClassMetaType
    width: number
}

export const ClassFieldTypeList = ['ForeignField', 'CharField', 'TextField', 'ForeignKey']

export type ClassFieldsType = {
    parent_class_name: string
    type: 'ForeignField' | 'CharField' | 'TextField' | 'ForeignKey'
    field_name: string
    id: string
    key_id?: string
    dif_y?: number
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
// eslint-disable-next-line no-unused-vars
import { Struct, StructResult } from './dataTypes' // FIXME

/**
 * Parses binary buffer (wrapped to DataView) according to a structure
 * description
 * @param dataView The DataView object
 * @param struct Structure description. The structure can't contain keys
 * starting with a digit due to the peculiarities of the javascript engine.
 * Otherwise, the reading result may be corrupted.
 * @param byteOffset Offset in buffer to read, "0" by default
 * @returns The structure applying result
 */
export const readStruct = function<T, S extends Struct<T>> (
  dataView: DataView,
  struct: S,
  byteOffset: number = 0
): StructResult<S> {
  let offset: number = byteOffset
  const structResult = {} as StructResult<S>

  for (const key in struct) {
    const value = struct[key].getValue(dataView, offset)

    // Skipping item
    if (value !== undefined) {
      ;(structResult as any)[key] = value
    }

    offset += struct[key].byteLength
  }

  return structResult
}

/**
 * @todo Describe me
 *
 * @param dataView The DataView object
 * @param struct Structure description. The structure can't contain keys
 * starting with a digit due to the peculiarities of the javascript engine.
 * Otherwise, the reading result may be corrupted.
 * @param byteOffset Offset in buffer to read, "0" by default
 * @param times Times of structure repeating
 * @returns The array of structure applying result
 */
export const readStructMultiple = function<T, S extends Struct<T>> (
  dataView: DataView,
  struct: S,
  byteOffset: number = 0,
  times: number = 1
): StructResult<S>[] {
  let offset: number = byteOffset
  const result: StructResult<S>[] = []

  for (let i = 0; i < times; i++) {
    const structResult = {} as StructResult<S>

    for (const key in struct) {
      const value = struct[key].getValue(dataView, offset)

      // Skipping item
      if (value !== undefined) {
        ;(structResult as any)[key] = value
      }

      offset += struct[key].byteLength
    }

    result[i] = structResult
  }

  return result
}

/**
 * Reads values of a structure in binary buffer without creating object
 * @param dataView The DataView object
 * @param struct Structure description
 * @param byteOffset Offset in buffer to read, "0" by default
 * @returns Iterator of struct values
 */
export const readStructValues = function * <T, S extends Struct<T>>(
  dataView: DataView,
  struct: S,
  byteOffset: number = 0
): IterableIterator<T> {
  let offset: number = byteOffset

  for (const key in struct) {
    yield struct[key].getValue(dataView, offset)

    offset += struct[key].byteLength
  }
}

/**
 * Returns length of a structure
 * @param struct Structure description
 */
export const getStructLength = (struct: Struct<any>): number => {
  let length: number = 0

  for (const key in struct) {
    length += struct[key].byteLength
  }

  return length
}

const getFilteredRandomPage = (
  min: number,
  max: number,
  used_pages: string[]
): string => {
  const pages = getNumberFromStringList(used_pages)

  let found = false
  let random = 1
  while (!found) {
    random = Math.floor(Math.random() * (max - min + 1)) + min
    if (!pages.includes(random)) {
      found = true
    }
  }
  const page = '' + random
  return page
}

const getNumberFromStringList = (pages: string[]): number[] => {
  return pages.map((x) => {
    return parseInt(x, 10)
  })
}

const getSlicedStringList = (list: string[], size: number) => {
  return list.sort(() => Math.random() - Math.random()).slice(0, size)
}

const getFilterdRandomNumberInRange = (
  min: number,
  max: number,
  already_used: number[]
): number => {
  let found = false
  let random = 1
  while (!found) {
    random = Math.floor(Math.random() * (max - min + 1)) + min
    if (!already_used.includes(random)) {
      found = true
    }
  }
  return random
}

const removeDuplicatesFromNumberList = (
  unfiltered_number_list: number[]
): number[] => {
  const filtered_number_list: number[] = []
  const number_list_set: Set<number> = new Set(unfiltered_number_list)
  number_list_set.forEach((n) => filtered_number_list.push(n))
  return filtered_number_list
}

export const utilsLib = {
  getSlicedStringList,
  getFilterdRandomNumberInRange,
  getFilteredRandomPage,
  removeDuplicatesFromNumberList,
}

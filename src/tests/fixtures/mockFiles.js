// Mock file objects for testing

export const createMockFile = (name, size = 1024, type = 'application/zip') => {
  const blob = new Blob(['a'.repeat(size)], { type })
  const file = new File([blob], name, { type })
  return file
}

export const mockKMLFile = createMockFile('zones.zip', 2048, 'application/zip')
export const mockExcelFile = createMockFile('data.xlsx', 1024, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
export const mockShapefileZip = createMockFile('edited_shapefile.zip', 3072, 'application/zip')

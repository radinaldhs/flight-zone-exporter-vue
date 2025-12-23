// Mock API responses for testing

export const mockGenerateShapefileResponse = {
  success: true,
  message: 'Shapefile generated successfully',
  total_zones: 5,
  zone_names: ['Zone_001', 'Zone_002', 'Zone_003', 'Zone_004', 'Zone_005'],
  filename: 'zones_for_edit.zip'
}

export const mockProcessResponse = {
  success: true,
  message: 'Processing complete',
  total_zones: 5,
  columns: ['Name', 'Flight_Con', 'Height', 'Route_Spacing'],
  filename: 'final_upload.zip'
}

export const mockUploadToArcGISResponse = {
  success: true,
  message: 'Upload complete',
  upload_result: { success: true },
  apply_edits_result: { success: true },
  features_added: 5
}

export const mockLoginResponse = {
  access_token: 'fake_jwt_token_12345',
  token_type: 'bearer',
  user: {
    id: 'user123',
    gis_auth_username: 'agasha123',
    full_name: 'Test User',
    is_active: true,
    created_at: new Date().toISOString()
  }
}

export const mockRegisterResponse = {
  access_token: 'fake_jwt_token_67890',
  token_type: 'bearer',
  user: {
    id: 'newuser456',
    gis_auth_username: 'newuser',
    full_name: 'New User',
    is_active: true,
    created_at: new Date().toISOString()
  }
}

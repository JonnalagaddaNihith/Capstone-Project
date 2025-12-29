export interface Booking {
  id: number;
  property_id: number;
  tenant_id: number;
  check_in: string;
  check_out: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  request_time: string;
  property_title?: string;
  property_location?: string;
  property_rent_per_day?: number;
  tenant_name?: string;
  tenant_email?: string;
}

export interface BookingCreateRequest {
  property_id: number;
  check_in: string;
  check_out: string;
}

export interface BookingStatusUpdateRequest {
  status: 'Approved' | 'Rejected';
}

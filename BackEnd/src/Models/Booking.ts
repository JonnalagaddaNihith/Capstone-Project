export interface Booking {
  id?: number;
  property_id: number;
  tenant_id: number;
  check_in: Date;
  check_out: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  request_time?: Date;
}

export interface BookingCreateDTO {
  property_id: number;
  tenant_id: number;
  check_in: string | Date;
  check_out: string | Date;
}

export interface BookingUpdateStatusDTO {
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface BookingResponseDTO {
  id: number;
  property_id: number;
  tenant_id: number;
  check_in: Date;
  check_out: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  request_time: Date;
  property_title?: string;
  tenant_name?: string;
  owner_id?: number;
}

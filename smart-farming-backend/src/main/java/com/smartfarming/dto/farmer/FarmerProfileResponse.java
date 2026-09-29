package com.smartfarming.dto.farmer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfileResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String phone;
    private String address;
}

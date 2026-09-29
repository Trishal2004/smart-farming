package com.smartfarming.dto.farmer;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmerProfileRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;
    private String address;
}

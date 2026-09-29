package com.smartfarming.dto.farm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmResponse {
    private Long id;
    private Long farmerProfileId;
    private String name;
    private String location;
    private Double areaSizeHectares;
    private String primarySoilType;
}

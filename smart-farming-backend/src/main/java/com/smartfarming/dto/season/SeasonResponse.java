package com.smartfarming.dto.season;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeasonResponse {
    private Long id;
    private Long farmId;
    private String seasonName;
    private LocalDate startDate;
    private LocalDate expectedEndDate;
    private String status;
}

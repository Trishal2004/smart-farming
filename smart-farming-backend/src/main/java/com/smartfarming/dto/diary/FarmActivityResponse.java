package com.smartfarming.dto.diary;

import com.smartfarming.entity.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmActivityResponse {
    private Long id;
    private Long seasonId;
    private LocalDate date;
    private ActivityType activityType;
    private String notes;
    private LocalDateTime createdAt;
}

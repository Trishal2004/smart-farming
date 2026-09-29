package com.smartfarming.dto.diary;

import com.smartfarming.entity.ActivityType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmActivityRequest {
    
    @NotNull(message = "Date is required")
    @PastOrPresent(message = "Activity date cannot be in the future")
    private LocalDate date;

    @NotNull(message = "Activity type is required")
    private ActivityType activityType;

    private String notes;
}

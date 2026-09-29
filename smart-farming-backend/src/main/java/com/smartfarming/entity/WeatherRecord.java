package com.smartfarming.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    private LocalDate recordDate;

    private Double temperature;
    private Double humidity;
    private Double rainfallMm;
    
    @Column(columnDefinition = "TEXT")
    private String advisoryNotes;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}

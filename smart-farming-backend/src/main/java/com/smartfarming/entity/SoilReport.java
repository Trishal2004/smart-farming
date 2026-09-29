package com.smartfarming.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "soil_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SoilReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    private Double nitrogen;
    private Double phosphorus;
    private Double potassium;
    private Double phLevel;
    
    private Double temperature;
    private Double humidity;
    private Double rainfall;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}

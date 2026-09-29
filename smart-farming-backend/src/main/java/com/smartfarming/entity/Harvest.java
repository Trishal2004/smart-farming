package com.smartfarming.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "harvests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Harvest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    @Column(nullable = false)
    private LocalDate harvestDate;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private Double sellingPricePerKg;

    private String buyerName;

    @Column(nullable = false)
    private Double totalIncome;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}

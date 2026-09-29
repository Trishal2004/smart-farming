package com.smartfarming.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    private Double seedCost;
    private Double fertilizerCost;
    private Double labourCost;
    private Double irrigationCost;
    private Double electricityCost;
    private Double transportCost;
    private Double pesticideCost;
    private Double otherExpenses;

    private Double totalInvestment;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}

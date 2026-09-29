package com.smartfarming.repository;

import com.smartfarming.entity.YieldPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YieldPredictionRepository extends JpaRepository<YieldPrediction, Long> {
    List<YieldPrediction> findBySeasonId(Long seasonId);
}

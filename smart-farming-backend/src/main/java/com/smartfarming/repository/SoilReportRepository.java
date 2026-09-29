package com.smartfarming.repository;

import com.smartfarming.entity.SoilReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoilReportRepository extends JpaRepository<SoilReport, Long> {
    List<SoilReport> findBySeasonId(Long seasonId);
}

package com.smartfarming.repository;

import com.smartfarming.entity.WeatherRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherRecordRepository extends JpaRepository<WeatherRecord, Long> {
    List<WeatherRecord> findBySeasonId(Long seasonId);
}

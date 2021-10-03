package com.tfg.inmobiliaria.repository;

import com.tfg.inmobiliaria.domain.Habitacion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Habitacion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HabitacionRepository extends JpaRepository<Habitacion, Long> {}

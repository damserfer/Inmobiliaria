package com.tfg.inmobiliaria.repository;

import com.tfg.inmobiliaria.domain.Ingreso;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ingreso entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IngresoRepository extends JpaRepository<Ingreso, Long> {}

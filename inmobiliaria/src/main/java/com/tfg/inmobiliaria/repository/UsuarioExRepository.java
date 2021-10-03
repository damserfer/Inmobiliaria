package com.tfg.inmobiliaria.repository;

import com.tfg.inmobiliaria.domain.UsuarioEx;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UsuarioEx entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UsuarioExRepository extends JpaRepository<UsuarioEx, Long> {}

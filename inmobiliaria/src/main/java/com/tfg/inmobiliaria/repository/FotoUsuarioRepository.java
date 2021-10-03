package com.tfg.inmobiliaria.repository;

import com.tfg.inmobiliaria.domain.FotoUsuario;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FotoUsuario entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FotoUsuarioRepository extends JpaRepository<FotoUsuario, Long> {}

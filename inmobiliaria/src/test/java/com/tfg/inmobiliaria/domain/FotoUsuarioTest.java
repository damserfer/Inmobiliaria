package com.tfg.inmobiliaria.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tfg.inmobiliaria.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FotoUsuarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FotoUsuario.class);
        FotoUsuario fotoUsuario1 = new FotoUsuario();
        fotoUsuario1.setId(1L);
        FotoUsuario fotoUsuario2 = new FotoUsuario();
        fotoUsuario2.setId(fotoUsuario1.getId());
        assertThat(fotoUsuario1).isEqualTo(fotoUsuario2);
        fotoUsuario2.setId(2L);
        assertThat(fotoUsuario1).isNotEqualTo(fotoUsuario2);
        fotoUsuario1.setId(null);
        assertThat(fotoUsuario1).isNotEqualTo(fotoUsuario2);
    }
}

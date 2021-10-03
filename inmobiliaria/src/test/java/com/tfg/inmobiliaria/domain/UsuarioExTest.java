package com.tfg.inmobiliaria.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tfg.inmobiliaria.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UsuarioExTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UsuarioEx.class);
        UsuarioEx usuarioEx1 = new UsuarioEx();
        usuarioEx1.setId(1L);
        UsuarioEx usuarioEx2 = new UsuarioEx();
        usuarioEx2.setId(usuarioEx1.getId());
        assertThat(usuarioEx1).isEqualTo(usuarioEx2);
        usuarioEx2.setId(2L);
        assertThat(usuarioEx1).isNotEqualTo(usuarioEx2);
        usuarioEx1.setId(null);
        assertThat(usuarioEx1).isNotEqualTo(usuarioEx2);
    }
}

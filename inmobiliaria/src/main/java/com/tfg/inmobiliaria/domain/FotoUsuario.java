package com.tfg.inmobiliaria.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A FotoUsuario.
 */
@Entity
@Table(name = "foto_usuario")
public class FotoUsuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "url")
    private String url;

    @ManyToOne
    @JsonIgnoreProperties(value = { "fotoUsuarios", "inmuebles", "contratoes" }, allowSetters = true)
    private UsuarioEx usuarioEx;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FotoUsuario id(Long id) {
        this.id = id;
        return this;
    }

    public String getUrl() {
        return this.url;
    }

    public FotoUsuario url(String url) {
        this.url = url;
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public UsuarioEx getUsuarioEx() {
        return this.usuarioEx;
    }

    public FotoUsuario usuarioEx(UsuarioEx usuarioEx) {
        this.setUsuarioEx(usuarioEx);
        return this;
    }

    public void setUsuarioEx(UsuarioEx usuarioEx) {
        this.usuarioEx = usuarioEx;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FotoUsuario)) {
            return false;
        }
        return id != null && id.equals(((FotoUsuario) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FotoUsuario{" +
            "id=" + getId() +
            ", url='" + getUrl() + "'" +
            "}";
    }
}

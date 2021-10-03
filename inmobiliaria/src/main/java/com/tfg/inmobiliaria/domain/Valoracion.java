package com.tfg.inmobiliaria.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Valoracion.
 */
@Entity
@Table(name = "valoracion")
public class Valoracion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comentario")
    private String comentario;

    @Column(name = "puntuacion")
    private Integer puntuacion;

    @ManyToOne
    @JsonIgnoreProperties(value = { "valoracions", "cargos", "usuarioEx", "inmueble" }, allowSetters = true)
    private Contrato contrato;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Valoracion id(Long id) {
        this.id = id;
        return this;
    }

    public String getComentario() {
        return this.comentario;
    }

    public Valoracion comentario(String comentario) {
        this.comentario = comentario;
        return this;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public Integer getPuntuacion() {
        return this.puntuacion;
    }

    public Valoracion puntuacion(Integer puntuacion) {
        this.puntuacion = puntuacion;
        return this;
    }

    public void setPuntuacion(Integer puntuacion) {
        this.puntuacion = puntuacion;
    }

    public Contrato getContrato() {
        return this.contrato;
    }

    public Valoracion contrato(Contrato contrato) {
        this.setContrato(contrato);
        return this;
    }

    public void setContrato(Contrato contrato) {
        this.contrato = contrato;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Valoracion)) {
            return false;
        }
        return id != null && id.equals(((Valoracion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Valoracion{" +
            "id=" + getId() +
            ", comentario='" + getComentario() + "'" +
            ", puntuacion=" + getPuntuacion() +
            "}";
    }
}

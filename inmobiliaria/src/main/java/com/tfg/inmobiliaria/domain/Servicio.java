package com.tfg.inmobiliaria.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Servicio.
 */
@Entity
@Table(name = "servicio")
public class Servicio implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "precio_horas")
    private Double precioHoras;

    @Column(name = "horas")
    private Integer horas;

    @ManyToOne
    @JsonIgnoreProperties(value = { "habitacions", "contratoes", "servicios", "usuarioEx" }, allowSetters = true)
    private Inmueble inmueble;

    @ManyToOne
    @JsonIgnoreProperties(value = { "servicios" }, allowSetters = true)
    private Empresa empresa;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Servicio id(Long id) {
        this.id = id;
        return this;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Servicio nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getPrecioHoras() {
        return this.precioHoras;
    }

    public Servicio precioHoras(Double precioHoras) {
        this.precioHoras = precioHoras;
        return this;
    }

    public void setPrecioHoras(Double precioHoras) {
        this.precioHoras = precioHoras;
    }

    public Integer getHoras() {
        return this.horas;
    }

    public Servicio horas(Integer horas) {
        this.horas = horas;
        return this;
    }

    public void setHoras(Integer horas) {
        this.horas = horas;
    }

    public Inmueble getInmueble() {
        return this.inmueble;
    }

    public Servicio inmueble(Inmueble inmueble) {
        this.setInmueble(inmueble);
        return this;
    }

    public void setInmueble(Inmueble inmueble) {
        this.inmueble = inmueble;
    }

    public Empresa getEmpresa() {
        return this.empresa;
    }

    public Servicio empresa(Empresa empresa) {
        this.setEmpresa(empresa);
        return this;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Servicio)) {
            return false;
        }
        return id != null && id.equals(((Servicio) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Servicio{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", precioHoras=" + getPrecioHoras() +
            ", horas=" + getHoras() +
            "}";
    }
}

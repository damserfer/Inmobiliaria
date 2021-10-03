package com.tfg.inmobiliaria.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Contrato.
 */
@Entity
@Table(name = "contrato")
public class Contrato implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "precio_alquiler")
    private LocalDate precioAlquiler;

    @OneToMany(mappedBy = "contrato")
    @JsonIgnoreProperties(value = { "contrato" }, allowSetters = true)
    private Set<Valoracion> valoracions = new HashSet<>();

    @OneToMany(mappedBy = "contrato")
    @JsonIgnoreProperties(value = { "ingreso", "contrato" }, allowSetters = true)
    private Set<Cargo> cargos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "fotoUsuarios", "inmuebles", "contratoes" }, allowSetters = true)
    private UsuarioEx usuarioEx;

    @ManyToOne
    @JsonIgnoreProperties(value = { "habitacions", "contratoes", "servicios", "usuarioEx" }, allowSetters = true)
    private Inmueble inmueble;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Contrato id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getFechaInicio() {
        return this.fechaInicio;
    }

    public Contrato fechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
        return this;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return this.fechaFin;
    }

    public Contrato fechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
        return this;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public LocalDate getPrecioAlquiler() {
        return this.precioAlquiler;
    }

    public Contrato precioAlquiler(LocalDate precioAlquiler) {
        this.precioAlquiler = precioAlquiler;
        return this;
    }

    public void setPrecioAlquiler(LocalDate precioAlquiler) {
        this.precioAlquiler = precioAlquiler;
    }

    public Set<Valoracion> getValoracions() {
        return this.valoracions;
    }

    public Contrato valoracions(Set<Valoracion> valoracions) {
        this.setValoracions(valoracions);
        return this;
    }

    public Contrato addValoracion(Valoracion valoracion) {
        this.valoracions.add(valoracion);
        valoracion.setContrato(this);
        return this;
    }

    public Contrato removeValoracion(Valoracion valoracion) {
        this.valoracions.remove(valoracion);
        valoracion.setContrato(null);
        return this;
    }

    public void setValoracions(Set<Valoracion> valoracions) {
        if (this.valoracions != null) {
            this.valoracions.forEach(i -> i.setContrato(null));
        }
        if (valoracions != null) {
            valoracions.forEach(i -> i.setContrato(this));
        }
        this.valoracions = valoracions;
    }

    public Set<Cargo> getCargos() {
        return this.cargos;
    }

    public Contrato cargos(Set<Cargo> cargos) {
        this.setCargos(cargos);
        return this;
    }

    public Contrato addCargo(Cargo cargo) {
        this.cargos.add(cargo);
        cargo.setContrato(this);
        return this;
    }

    public Contrato removeCargo(Cargo cargo) {
        this.cargos.remove(cargo);
        cargo.setContrato(null);
        return this;
    }

    public void setCargos(Set<Cargo> cargos) {
        if (this.cargos != null) {
            this.cargos.forEach(i -> i.setContrato(null));
        }
        if (cargos != null) {
            cargos.forEach(i -> i.setContrato(this));
        }
        this.cargos = cargos;
    }

    public UsuarioEx getUsuarioEx() {
        return this.usuarioEx;
    }

    public Contrato usuarioEx(UsuarioEx usuarioEx) {
        this.setUsuarioEx(usuarioEx);
        return this;
    }

    public void setUsuarioEx(UsuarioEx usuarioEx) {
        this.usuarioEx = usuarioEx;
    }

    public Inmueble getInmueble() {
        return this.inmueble;
    }

    public Contrato inmueble(Inmueble inmueble) {
        this.setInmueble(inmueble);
        return this;
    }

    public void setInmueble(Inmueble inmueble) {
        this.inmueble = inmueble;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contrato)) {
            return false;
        }
        return id != null && id.equals(((Contrato) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Contrato{" +
            "id=" + getId() +
            ", fechaInicio='" + getFechaInicio() + "'" +
            ", fechaFin='" + getFechaFin() + "'" +
            ", precioAlquiler='" + getPrecioAlquiler() + "'" +
            "}";
    }
}

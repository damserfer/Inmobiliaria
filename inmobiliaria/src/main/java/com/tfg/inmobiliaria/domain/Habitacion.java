package com.tfg.inmobiliaria.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Habitacion.
 */
@Entity
@Table(name = "habitacion")
public class Habitacion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "precio")
    private Double precio;

    @Column(name = "descripcion")
    private String descripcion;

    @OneToMany(mappedBy = "habitacion")
    @JsonIgnoreProperties(value = { "habitacion" }, allowSetters = true)
    private Set<FotoHabitacion> fotoHabitacions = new HashSet<>();

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

    public Habitacion id(Long id) {
        this.id = id;
        return this;
    }

    public Double getPrecio() {
        return this.precio;
    }

    public Habitacion precio(Double precio) {
        this.precio = precio;
        return this;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Habitacion descripcion(String descripcion) {
        this.descripcion = descripcion;
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Set<FotoHabitacion> getFotoHabitacions() {
        return this.fotoHabitacions;
    }

    public Habitacion fotoHabitacions(Set<FotoHabitacion> fotoHabitacions) {
        this.setFotoHabitacions(fotoHabitacions);
        return this;
    }

    public Habitacion addFotoHabitacion(FotoHabitacion fotoHabitacion) {
        this.fotoHabitacions.add(fotoHabitacion);
        fotoHabitacion.setHabitacion(this);
        return this;
    }

    public Habitacion removeFotoHabitacion(FotoHabitacion fotoHabitacion) {
        this.fotoHabitacions.remove(fotoHabitacion);
        fotoHabitacion.setHabitacion(null);
        return this;
    }

    public void setFotoHabitacions(Set<FotoHabitacion> fotoHabitacions) {
        if (this.fotoHabitacions != null) {
            this.fotoHabitacions.forEach(i -> i.setHabitacion(null));
        }
        if (fotoHabitacions != null) {
            fotoHabitacions.forEach(i -> i.setHabitacion(this));
        }
        this.fotoHabitacions = fotoHabitacions;
    }

    public Inmueble getInmueble() {
        return this.inmueble;
    }

    public Habitacion inmueble(Inmueble inmueble) {
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
        if (!(o instanceof Habitacion)) {
            return false;
        }
        return id != null && id.equals(((Habitacion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Habitacion{" +
            "id=" + getId() +
            ", precio=" + getPrecio() +
            ", descripcion='" + getDescripcion() + "'" +
            "}";
    }
}

package com.tfg.inmobiliaria.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Empresa.
 */
@Entity
@Table(name = "empresa")
public class Empresa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cif")
    private String cif;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "calle")
    private String calle;

    @Column(name = "numero")
    private Integer numero;

    @Column(name = "ciudad")
    private String ciudad;

    @Column(name = "web")
    private String web;

    @Column(name = "telefono")
    private String telefono;

    @OneToMany(mappedBy = "empresa")
    @JsonIgnoreProperties(value = { "inmueble", "empresa" }, allowSetters = true)
    private Set<Servicio> servicios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Empresa id(Long id) {
        this.id = id;
        return this;
    }

    public String getCif() {
        return this.cif;
    }

    public Empresa cif(String cif) {
        this.cif = cif;
        return this;
    }

    public void setCif(String cif) {
        this.cif = cif;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Empresa nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCalle() {
        return this.calle;
    }

    public Empresa calle(String calle) {
        this.calle = calle;
        return this;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public Integer getNumero() {
        return this.numero;
    }

    public Empresa numero(Integer numero) {
        this.numero = numero;
        return this;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public String getCiudad() {
        return this.ciudad;
    }

    public Empresa ciudad(String ciudad) {
        this.ciudad = ciudad;
        return this;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getWeb() {
        return this.web;
    }

    public Empresa web(String web) {
        this.web = web;
        return this;
    }

    public void setWeb(String web) {
        this.web = web;
    }

    public String getTelefono() {
        return this.telefono;
    }

    public Empresa telefono(String telefono) {
        this.telefono = telefono;
        return this;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Set<Servicio> getServicios() {
        return this.servicios;
    }

    public Empresa servicios(Set<Servicio> servicios) {
        this.setServicios(servicios);
        return this;
    }

    public Empresa addServicio(Servicio servicio) {
        this.servicios.add(servicio);
        servicio.setEmpresa(this);
        return this;
    }

    public Empresa removeServicio(Servicio servicio) {
        this.servicios.remove(servicio);
        servicio.setEmpresa(null);
        return this;
    }

    public void setServicios(Set<Servicio> servicios) {
        if (this.servicios != null) {
            this.servicios.forEach(i -> i.setEmpresa(null));
        }
        if (servicios != null) {
            servicios.forEach(i -> i.setEmpresa(this));
        }
        this.servicios = servicios;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Empresa)) {
            return false;
        }
        return id != null && id.equals(((Empresa) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Empresa{" +
            "id=" + getId() +
            ", cif='" + getCif() + "'" +
            ", nombre='" + getNombre() + "'" +
            ", calle='" + getCalle() + "'" +
            ", numero=" + getNumero() +
            ", ciudad='" + getCiudad() + "'" +
            ", web='" + getWeb() + "'" +
            ", telefono='" + getTelefono() + "'" +
            "}";
    }
}

package com.tfg.inmobiliaria.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Inmueble.
 */
@Entity
@Table(name = "inmueble")
public class Inmueble implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "calle")
    private String calle;

    @Column(name = "numero")
    private Integer numero;

    @Column(name = "escalera")
    private Integer escalera;

    @Column(name = "cod_postal")
    private Integer codPostal;

    @Column(name = "ciudad")
    private String ciudad;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "nbanios")
    private Integer nbanios;

    @OneToMany(mappedBy = "inmueble")
    @JsonIgnoreProperties(value = { "fotoHabitacions", "inmueble" }, allowSetters = true)
    private Set<Habitacion> habitacions = new HashSet<>();

    @OneToMany(mappedBy = "inmueble")
    @JsonIgnoreProperties(value = { "valoracions", "cargos", "usuarioEx", "inmueble" }, allowSetters = true)
    private Set<Contrato> contratoes = new HashSet<>();

    @OneToMany(mappedBy = "inmueble")
    @JsonIgnoreProperties(value = { "inmueble", "empresa" }, allowSetters = true)
    private Set<Servicio> servicios = new HashSet<>();

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

    public Inmueble id(Long id) {
        this.id = id;
        return this;
    }

    public String getCalle() {
        return this.calle;
    }

    public Inmueble calle(String calle) {
        this.calle = calle;
        return this;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public Integer getNumero() {
        return this.numero;
    }

    public Inmueble numero(Integer numero) {
        this.numero = numero;
        return this;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public Integer getEscalera() {
        return this.escalera;
    }

    public Inmueble escalera(Integer escalera) {
        this.escalera = escalera;
        return this;
    }

    public void setEscalera(Integer escalera) {
        this.escalera = escalera;
    }

    public Integer getCodPostal() {
        return this.codPostal;
    }

    public Inmueble codPostal(Integer codPostal) {
        this.codPostal = codPostal;
        return this;
    }

    public void setCodPostal(Integer codPostal) {
        this.codPostal = codPostal;
    }

    public String getCiudad() {
        return this.ciudad;
    }

    public Inmueble ciudad(String ciudad) {
        this.ciudad = ciudad;
        return this;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Inmueble descripcion(String descripcion) {
        this.descripcion = descripcion;
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getNbanios() {
        return this.nbanios;
    }

    public Inmueble nbanios(Integer nbanios) {
        this.nbanios = nbanios;
        return this;
    }

    public void setNbanios(Integer nbanios) {
        this.nbanios = nbanios;
    }

    public Set<Habitacion> getHabitacions() {
        return this.habitacions;
    }

    public Inmueble habitacions(Set<Habitacion> habitacions) {
        this.setHabitacions(habitacions);
        return this;
    }

    public Inmueble addHabitacion(Habitacion habitacion) {
        this.habitacions.add(habitacion);
        habitacion.setInmueble(this);
        return this;
    }

    public Inmueble removeHabitacion(Habitacion habitacion) {
        this.habitacions.remove(habitacion);
        habitacion.setInmueble(null);
        return this;
    }

    public void setHabitacions(Set<Habitacion> habitacions) {
        if (this.habitacions != null) {
            this.habitacions.forEach(i -> i.setInmueble(null));
        }
        if (habitacions != null) {
            habitacions.forEach(i -> i.setInmueble(this));
        }
        this.habitacions = habitacions;
    }

    public Set<Contrato> getContratoes() {
        return this.contratoes;
    }

    public Inmueble contratoes(Set<Contrato> contratoes) {
        this.setContratoes(contratoes);
        return this;
    }

    public Inmueble addContrato(Contrato contrato) {
        this.contratoes.add(contrato);
        contrato.setInmueble(this);
        return this;
    }

    public Inmueble removeContrato(Contrato contrato) {
        this.contratoes.remove(contrato);
        contrato.setInmueble(null);
        return this;
    }

    public void setContratoes(Set<Contrato> contratoes) {
        if (this.contratoes != null) {
            this.contratoes.forEach(i -> i.setInmueble(null));
        }
        if (contratoes != null) {
            contratoes.forEach(i -> i.setInmueble(this));
        }
        this.contratoes = contratoes;
    }

    public Set<Servicio> getServicios() {
        return this.servicios;
    }

    public Inmueble servicios(Set<Servicio> servicios) {
        this.setServicios(servicios);
        return this;
    }

    public Inmueble addServicio(Servicio servicio) {
        this.servicios.add(servicio);
        servicio.setInmueble(this);
        return this;
    }

    public Inmueble removeServicio(Servicio servicio) {
        this.servicios.remove(servicio);
        servicio.setInmueble(null);
        return this;
    }

    public void setServicios(Set<Servicio> servicios) {
        if (this.servicios != null) {
            this.servicios.forEach(i -> i.setInmueble(null));
        }
        if (servicios != null) {
            servicios.forEach(i -> i.setInmueble(this));
        }
        this.servicios = servicios;
    }

    public UsuarioEx getUsuarioEx() {
        return this.usuarioEx;
    }

    public Inmueble usuarioEx(UsuarioEx usuarioEx) {
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
        if (!(o instanceof Inmueble)) {
            return false;
        }
        return id != null && id.equals(((Inmueble) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Inmueble{" +
            "id=" + getId() +
            ", calle='" + getCalle() + "'" +
            ", numero=" + getNumero() +
            ", escalera=" + getEscalera() +
            ", codPostal=" + getCodPostal() +
            ", ciudad='" + getCiudad() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            ", nbanios=" + getNbanios() +
            "}";
    }
}

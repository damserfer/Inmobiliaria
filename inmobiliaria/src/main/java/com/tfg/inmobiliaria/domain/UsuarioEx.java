package com.tfg.inmobiliaria.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A UsuarioEx.
 */
@Entity
@Table(name = "usuario_ex")
public class UsuarioEx implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dni")
    private String dni;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellidos")
    private String apellidos;

    @Column(name = "password")
    private String password;

    @OneToMany(mappedBy = "usuarioEx")
    @JsonIgnoreProperties(value = { "usuarioEx" }, allowSetters = true)
    private Set<FotoUsuario> fotoUsuarios = new HashSet<>();

    @OneToMany(mappedBy = "usuarioEx")
    @JsonIgnoreProperties(value = { "habitacions", "contratoes", "servicios", "usuarioEx" }, allowSetters = true)
    private Set<Inmueble> inmuebles = new HashSet<>();

    @OneToMany(mappedBy = "usuarioEx")
    @JsonIgnoreProperties(value = { "valoracions", "cargos", "usuarioEx", "inmueble" }, allowSetters = true)
    private Set<Contrato> contratoes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UsuarioEx id(Long id) {
        this.id = id;
        return this;
    }

    public String getDni() {
        return this.dni;
    }

    public UsuarioEx dni(String dni) {
        this.dni = dni;
        return this;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return this.nombre;
    }

    public UsuarioEx nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return this.apellidos;
    }

    public UsuarioEx apellidos(String apellidos) {
        this.apellidos = apellidos;
        return this;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getPassword() {
        return this.password;
    }

    public UsuarioEx password(String password) {
        this.password = password;
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<FotoUsuario> getFotoUsuarios() {
        return this.fotoUsuarios;
    }

    public UsuarioEx fotoUsuarios(Set<FotoUsuario> fotoUsuarios) {
        this.setFotoUsuarios(fotoUsuarios);
        return this;
    }

    public UsuarioEx addFotoUsuario(FotoUsuario fotoUsuario) {
        this.fotoUsuarios.add(fotoUsuario);
        fotoUsuario.setUsuarioEx(this);
        return this;
    }

    public UsuarioEx removeFotoUsuario(FotoUsuario fotoUsuario) {
        this.fotoUsuarios.remove(fotoUsuario);
        fotoUsuario.setUsuarioEx(null);
        return this;
    }

    public void setFotoUsuarios(Set<FotoUsuario> fotoUsuarios) {
        if (this.fotoUsuarios != null) {
            this.fotoUsuarios.forEach(i -> i.setUsuarioEx(null));
        }
        if (fotoUsuarios != null) {
            fotoUsuarios.forEach(i -> i.setUsuarioEx(this));
        }
        this.fotoUsuarios = fotoUsuarios;
    }

    public Set<Inmueble> getInmuebles() {
        return this.inmuebles;
    }

    public UsuarioEx inmuebles(Set<Inmueble> inmuebles) {
        this.setInmuebles(inmuebles);
        return this;
    }

    public UsuarioEx addInmueble(Inmueble inmueble) {
        this.inmuebles.add(inmueble);
        inmueble.setUsuarioEx(this);
        return this;
    }

    public UsuarioEx removeInmueble(Inmueble inmueble) {
        this.inmuebles.remove(inmueble);
        inmueble.setUsuarioEx(null);
        return this;
    }

    public void setInmuebles(Set<Inmueble> inmuebles) {
        if (this.inmuebles != null) {
            this.inmuebles.forEach(i -> i.setUsuarioEx(null));
        }
        if (inmuebles != null) {
            inmuebles.forEach(i -> i.setUsuarioEx(this));
        }
        this.inmuebles = inmuebles;
    }

    public Set<Contrato> getContratoes() {
        return this.contratoes;
    }

    public UsuarioEx contratoes(Set<Contrato> contratoes) {
        this.setContratoes(contratoes);
        return this;
    }

    public UsuarioEx addContrato(Contrato contrato) {
        this.contratoes.add(contrato);
        contrato.setUsuarioEx(this);
        return this;
    }

    public UsuarioEx removeContrato(Contrato contrato) {
        this.contratoes.remove(contrato);
        contrato.setUsuarioEx(null);
        return this;
    }

    public void setContratoes(Set<Contrato> contratoes) {
        if (this.contratoes != null) {
            this.contratoes.forEach(i -> i.setUsuarioEx(null));
        }
        if (contratoes != null) {
            contratoes.forEach(i -> i.setUsuarioEx(this));
        }
        this.contratoes = contratoes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UsuarioEx)) {
            return false;
        }
        return id != null && id.equals(((UsuarioEx) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UsuarioEx{" +
            "id=" + getId() +
            ", dni='" + getDni() + "'" +
            ", nombre='" + getNombre() + "'" +
            ", apellidos='" + getApellidos() + "'" +
            ", password='" + getPassword() + "'" +
            "}";
    }
}

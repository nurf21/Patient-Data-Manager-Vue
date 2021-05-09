<template>
  <div>
    <b-row>
      <b-col lg="12" class="my-1">
        <b-button class="add-btn" variant="primary" v-b-modal.modal-1 @click="addButton()">
          Add patient
        </b-button>
      </b-col>
    </b-row>
    <b-table
      id="patient-table"
      responsive
      striped
      hover
      :items="patientData"
      :fields="fields"
      :per-page="limit"
      :current-page="page"
      style="text-align: center"
    >
      <template #cell(actions)="data">
        <img
          src="@/assets/img/edit.png"
          class="m-2 d-inline-block align-top action-img"
          alt="edit"
          v-b-modal.modal-1
          @click="setPatient(data)"
        />
        <img
          src="@/assets/img/delete.png"
          class="m-2 d-inline-block align-top action-img"
          alt="delete"
          v-b-modal.modal-3
          @click="showDelBoxProd(data)"
        />
      </template>
    </b-table>
    <b-pagination
      v-model="page"
      :total-rows="totalRows"
      :per-page="limit"
      align="center"
      class="my-0"
      aria-controls="patient-table"
    ></b-pagination>

    <b-modal id="modal-1" :title="modalTitle" hide-footer>
      <b-form @submit.prevent="onSubmit">
        <b-form-group label-cols-sm="3" label="Name" label-for="nested-name">
          <b-form-input id="nested-name" v-model="form.name" required></b-form-input>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="Sex" label-for="nested-sex">
          <b-form-select v-model="form.sex" :options="sexOptions" id="nested-sex" required></b-form-select>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="Religion" label-for="nested-religion">
          <b-form-select v-model="form.religion" :options="religionOptions" id="nested-religion" required></b-form-select>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="Phone" label-for="nested-phone">
          <b-form-input id="nested-phone" v-model="form.phone" required></b-form-input>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="Address" label-for="nested-address">
          <b-form-input id="nested-address" v-model="form.address" required></b-form-input>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="NIK" label-for="nested-nik">
          <b-form-input id="nested-nik" v-model="form.nik" required></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" v-show="!isUpdate" class="submit-btn">Submit</b-button>
        <b-button type="button" variant="primary" v-show="isUpdate" @click="onUpdate()" class="submit-btn">Update</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  name: 'Patient',
  data () {
    return {
      form: {},
      modalTitle: '',
      isUpdate: false,
      page: 1,
      limit: 5,
      fields: [
        { key: 'Name' },
        { key: 'Sex' },
        { key: 'Religion' },
        { key: 'Phone' },
        { key: 'Address' },
        { key: 'NIK' },
        'actions'
      ],
      sexOptions: [
        { value: 'Laki-laki', text: 'Laki-laki' },
        { value: 'Perempuan', text: 'Perempuan' }
      ],
      religionOptions: [
        { value: 'Islam', text: 'Islam' },
        { value: 'Kristen', text: 'Kristen' },
        { value: 'Katolik', text: 'Katolik' },
        { value: 'Hindu', text: 'Hindu' },
        { value: 'Buddha', text: 'Buddha' },
        { value: 'Khonghucu', text: 'Khonghucu' }
      ]
    }
  },
  methods: {
    ...mapActions(['getPatient', 'addPatient', 'patchPatient', 'deletePatient']),
    ...mapMutations(['clearPatient']),
    addButton () {
      this.form = {
        name: '',
        sex: '',
        religion: '',
        phone: '',
        address: '',
        nik: ''
      }
      this.modalTitle = 'Add Patient'
      this.isUpdate = false
    },
    onSubmit () {
      this.addPatient(this.form)
        .then(result => {
          this.getPatient()
          this.makeToast('success', 'Success', 'New Patient Added')
          this.$bvModal.hide('modal-1')
        })
        .catch(error => {
          this.makeToast('danger', 'Error', error.data.msg)
        })
    },
    setPatient (value) {
      this.form = {
        name: value.item.Name,
        sex: value.item.Sex,
        religion: value.item.Religion,
        phone: value.item.Phone,
        address: value.item.Address,
        nik: value.item.NIK
      }
      this.modalTitle = 'Edit Patient Data'
      this.isUpdate = true
      this.id = value.item.ID
    },
    onUpdate () {
      const payload = {
        id: this.id,
        form: this.form
      }
      this.patchPatient(payload).then(result => {
        this.getPatient()
        this.makeToast('success', 'Success', 'Patient Data Updated')
        this.$bvModal.hide('modal-1')
        this.isUpdate = false
      }).catch((error) => {
        this.makeToast('danger', 'Error', error.data.msg)
      })
    },
    showDelBoxProd (data) {
      this.$bvModal.msgBoxConfirm(`Are you sure want to delete ${data.item.Name}'s Data ?`, {
        title: 'Delete Patient Data',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      }).then(value => {
        if (value === true) {
          this.deletePatient(data.item.ID).then(result => {
            this.getPatient()
            this.makeToast('success', 'Success', 'Patient Deleted')
          }).catch(error => {
            this.makeToast('danger', 'Error', error.data.msg)
          })
        }
      })
        .catch(error => {
          console.log(error)
        })
    },
    makeToast (variant, title, msg) {
      this.$bvToast.toast(msg, {
        title,
        variant: variant,
        solid: true
      })
    }
  },
  computed: {
    ...mapGetters({ patientData: 'getPatient', totalRows: 'getTotalRows' })
  },
  created () {
    this.clearPatient()
    this.getPatient()
  }
}
</script>

<style scoped src="@/assets/css/style.css"></style>

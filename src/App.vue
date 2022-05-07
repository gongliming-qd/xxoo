<template>
  <div id="app" style="background-color:#29292d;">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  
  mounted(){
    window.addEventListener('contextmenu', (e)=>{
      e.preventDefault();
    })
  }
}
</script>

<style>

</style>

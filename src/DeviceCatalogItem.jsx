function DeviceCatalogItem({device, addNewDevice}) {

  return (
    <button className="device-catalog-item" onClick={()=>{addNewDevice(device.deviceType)}}>
        <span>{device.label}</span>
        <span className="catalog-item-add" aria-hidden="true">+</span>
    </button>
  )
}

export default DeviceCatalogItem

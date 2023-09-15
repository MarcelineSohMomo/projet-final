import { Table } from 'react-bootstrap';


function DataTable({data}) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Service</th>
          <th>Nombre total de commandes complétées</th>
          <th>Montant total</th>
          <th>Détails des commandes</th>
        </tr>
      </thead>
      <tbody>
        {data.map(service => (
          <tr key={service._id}>
            <td>{service.orders[0].name}</td>
            <td>{service.totalCompleted}</td>
            <td>{service.totalAmount}</td>
            <td>
              {service.orders.map(order => (
                <div key={order._id}>
                  <strong>Commande ID:</strong> {order._id}<br/>
                  <strong>Client:</strong> {order.customer}<br/>
                  <strong>Prix:</strong> {order.price}<br/>
                  <strong>Status:</strong> {order.status}<br/>
                </div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default DataTable;

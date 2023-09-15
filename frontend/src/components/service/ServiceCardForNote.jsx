import { Carousel, Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

function ServiceCardForNote({service}) {
  return (
    
      <Card>
          {service.imgs && service.imgs.length > 0 ? (
            <Carousel>
              {service.imgs.map((image, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100" src={`http://localhost:5000/${image}`} alt="Service" />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div
              className="bg-light d-flex align-items-center justify-content-center"
              style={{ height: '200px', cursor: 'pointer' }}
            >
              <p className="text-muted">Aucune image</p>
            </div>
          )}
          <div className="mt-2">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
      </Card>
  )
}

export default ServiceCardForNote;

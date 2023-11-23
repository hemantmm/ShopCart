import {Col, Row} from 'react-bootstrap'
import { StoreItem } from '../components/StoreItem'
import storeItems from '../data/items.json'
import SlideShow from '../components/SlideShow'
import logo1 from '../../public/imgs/adidas.png'
import logo2 from '../../public/imgs/adidas1.png'
import logo3 from '../../public/imgs/book1.png'
import logo4 from '../../public/imgs/book2.png'
import logo5 from '../../public/imgs/dell.png'
import logo6 from '../../public/imgs/iphone.png'
import logo7 from '../../public/imgs/iphone14.png'
import logo8 from '../../public/imgs/macbook.png'
import logo9 from '../../public/imgs/nikejordan.png'
import logo10 from '../../public/imgs/nikejordan1.png'

const slides = [
    { id: 1, imageUrl: logo1 },
    { id: 2, imageUrl: logo2 },
    { id: 3, imageUrl: logo3 },
    { id: 4, imageUrl: logo4 },
    { id: 5, imageUrl: logo5 },
    { id: 6, imageUrl: logo6 },
    { id: 7, imageUrl: logo7 },
    { id: 8, imageUrl: logo8 },
    { id: 9, imageUrl: logo9 },
    { id: 10, imageUrl: logo10 },
    // Add more slides as needed
  ];


export function Home()
{
    return(
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'2rem'}}>
            {/* <About /> */}
            <SlideShow slides={slides} />
        <Row md={2} xs={1} lg={3} className='g-3'>
            {storeItems.map(item => (
            <Col key={item.id}>
                <StoreItem {...item} />
                </Col>
            ))}
        </Row>
        </div>
    )
}
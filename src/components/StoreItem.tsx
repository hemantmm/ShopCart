import {Card, Button} from 'react-bootstrap'
import { formatCurrency } from '../utilities/formatCurrency'
import { useShoppingCart } from '../context/ShoppingCartContext'
import { RiStarSFill } from "react-icons/ri";

type StoreItemProps={
    id:number,
    name:string,
    price:number,
    rating:number,
    imgUrl:string
}

// const generateRatingStars=(rating:number)=>'<RiStarSFill />'.repeat(rating)
export function StoreItem({id,name,price,imgUrl,rating}:StoreItemProps)
{
    const {getItemQuantity, increaseItemQuantity,decreaseItemQuantity,removeFromCart}=useShoppingCart()
    const quantity=getItemQuantity(id)

    return(
        <Card className='h-100'>
            <Card.Img variant='top' src={imgUrl} height="200px" style={{objectFit:"cover"}} />
            <Card.Body className='d-flex flex-column'>
                <Card.Title className='d-flex justify-content-between align-items-baseline mb-4'>
                    <span className='fs-2'>{name}</span>
                    <span className='ms-2 text-muted'>{formatCurrency(price)}</span>
                </Card.Title>
                <div className="mt-auto">
                    {quantity === 0 ?(
                        <Button className='w-100' onClick={()=>increaseItemQuantity(id)}>Add to cart</Button>
                    ):<div className='d-flex align-items-center flex-column' style={{gap:"0.5rem"}}>
                        <div className="d-flex align-items-center justify-content-center" style={{gap:"0.5rem"}}>
                           <Button onClick={()=>decreaseItemQuantity(id)}>-</Button>
                           <div>
                            <span className='fs-3'>{quantity}</span>
                            in cart
                           </div>
                           <Button onClick={()=>increaseItemQuantity(id)}>+</Button>
                        </div>
                        <Button variant='danger' onClick={()=>removeFromCart(id)} size='sm'>Remove</Button>
                    </div>
                    }
                    <div className='d-flex align-items-center' style={{marginTop:'1rem'}}>
            {[...Array(rating)].map((_, index) => (
              <RiStarSFill key={index} size={20} className='text-warning' />
            ))}
          </div>
                </div>
            </Card.Body>
        </Card>
    )
}
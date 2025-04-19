
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Mock data for tracking
const trackingData = {
  'ORD-1234567': {
    id: 'ORD-1234567',
    trackingNumber: 'TRK-987654321',
    carrier: 'FedEx',
    estimatedDelivery: '2023-08-18',
    status: 'Delivered',
    events: [
      { date: '2023-08-18 14:30', status: 'Delivered', location: 'Your doorstep', description: 'Package delivered to recipient' },
      { date: '2023-08-18 08:45', status: 'Out for Delivery', location: 'Local Facility', description: 'Package is out for delivery' },
      { date: '2023-08-17 19:20', status: 'Arrived at Facility', location: 'Local Facility', description: 'Package arrived at carrier facility' },
      { date: '2023-08-16 15:10', status: 'In Transit', location: 'Regional Hub', description: 'Package in transit to destination' },
      { date: '2023-08-15 10:00', status: 'Shipped', location: 'Fulfillment Center', description: 'Package has shipped' },
      { date: '2023-08-14 16:50', status: 'Processing', location: 'Fulfillment Center', description: 'Package is being processed' },
    ]
  },
  'ORD-7654321': {
    id: 'ORD-7654321',
    trackingNumber: 'TRK-123456789',
    carrier: 'UPS',
    estimatedDelivery: '2023-08-22',
    status: 'Shipped',
    events: [
      { date: '2023-08-19 12:30', status: 'In Transit', location: 'Regional Hub', description: 'Package in transit to destination' },
      { date: '2023-08-18 08:45', status: 'In Transit', location: 'Distribution Center', description: 'Package processed at distribution center' },
      { date: '2023-08-17 14:20', status: 'Shipped', location: 'Fulfillment Center', description: 'Package has shipped' },
      { date: '2023-08-17 09:10', status: 'Processing', location: 'Fulfillment Center', description: 'Package is being processed' },
    ]
  },
  'ORD-9876543': {
    id: 'ORD-9876543',
    trackingNumber: '',
    carrier: '',
    estimatedDelivery: '2023-08-25',
    status: 'Processing',
    events: [
      { date: '2023-08-16 10:20', status: 'Processing', location: 'Fulfillment Center', description: 'Order is being processed' },
    ]
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Delivered':
      return <CheckCircle2 size={18} className="text-green-600" />;
    case 'Out for Delivery':
    case 'In Transit':
      return <Truck size={18} className="text-blue-600" />;
    case 'Shipped':
      return <Package size={18} className="text-blue-600" />;
    case 'Processing':
      return <Package size={18} className="text-blue-600" />;
    default:
      return <MapPin size={18} className="text-gray-600" />;
  }
};

const TrackingTimeline = ({ events }: { events: any[] }) => (
  <div className="mt-4 relative pb-5">
    {events.map((event, index) => (
      <div key={index} className="relative pl-6 mb-6 last:mb-0">
        {/* Vertical line */}
        {index < events.length - 1 && (
          <div className="absolute top-0 left-[9px] bottom-0 w-[1px] bg-gray-200" />
        )}
        
        {/* Event dot */}
        <div className="absolute top-0 left-0 w-[18px] h-[18px] rounded-full bg-white border-2 border-blue-200 flex items-center justify-center">
          {index === 0 ? 
            <div className="w-[8px] h-[8px] rounded-full bg-blue-500" /> : 
            <div className="w-[6px] h-[6px] rounded-full bg-gray-300" />
          }
        </div>
        
        {/* Event content */}
        <div>
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium flex items-center gap-1.5">
              {getStatusIcon(event.status)}
              {event.status}
            </h4>
            <time className="text-[10px] text-gray-500">{new Date(event.date).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}</time>
          </div>
          <p className="text-xs text-gray-700 mt-0.5">{event.description}</p>
          <p className="text-xs text-gray-500 mt-0.5">{event.location}</p>
        </div>
      </div>
    ))}
  </div>
);

const Tracking = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Find the order data based on the ID from URL
  const trackingInfo = id ? trackingData[id as keyof typeof trackingData] : null;
  
  if (!trackingInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
        <p className="text-sm text-gray-600 mb-4">The order you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/orders')} variant="outline">Go to Orders</Button>
      </div>
    );
  }
  
  return (
    <div className="pb-12 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-3 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-lg font-semibold">Track Order</h1>
          </div>
        </div>
      </div>
      
      {/* Order Info */}
      <div className="p-3">
        <Card className="mb-4 border border-gray-100 shadow-sm">
          <CardContent className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium">{trackingInfo.id}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs text-gray-600">
                    {trackingInfo.trackingNumber ? 
                      <>Tracking: <span className="font-medium">{trackingInfo.trackingNumber}</span></> : 
                      'No tracking available yet'
                    }
                  </span>
                </div>
              </div>
              <Badge variant="outline" className={`
                ${trackingInfo.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                ${trackingInfo.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                ${trackingInfo.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
              `}>
                {trackingInfo.status}
              </Badge>
            </div>
            
            {trackingInfo.carrier && (
              <>
                <Separator className="my-2" />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Carrier</span>
                  <span className="font-medium">{trackingInfo.carrier}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="font-medium">{new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Tracking Timeline */}
        <Card className="border border-gray-100 shadow-sm">
          <CardContent className="p-3">
            <h3 className="text-sm font-medium mb-1">Shipment Progress</h3>
            <TrackingTimeline events={trackingInfo.events} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tracking;

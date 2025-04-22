// logoAPI.js (Client Side)

// Bugs : The first logo isn't being displayed, all logos are being displayed after generation is completed instead of streaming

/**
 * Generates the first logo and returns the initial data
 * @param {string} companyName - The company name to generate logos for
 * @returns {Promise<Object>} - The response with first logo and task ID
 */
export async function generateFirstLogo(companyName) {
    try {
      const response = await fetch('http://localhost:5080/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uInput: companyName }), 
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating first logo:', error);
      throw error;
    }
  }
  
  /**
   * Streams additional logos, calling the callback for each new logo
   * @param {string} taskId - The task ID from the initial logo generation
   * @param {string} companyName - The company name
   * @param {Function} onLogoGenerated - Callback called when each new logo is generated
   * @param {Function} onComplete - Callback called when all logos are generated
   * @param {Function} onError - Callback called on error
   * @param {Function} onAbort - Callback called when generation is aborted
   * @returns {Object} - The controller object with abort method
   */
  export function streamLogos(taskId, companyName, onLogoGenerated, onComplete, onError, onAbort) {
    // Create a controller object
    const controller = {
      isActive: true,
      eventSource: null,
      abort: async () => {
        console.log('Aborting logo generation...');
        controller.isActive = false;
        if (controller.eventSource) {
          controller.eventSource.close();
        }
        
        // Send abort request to server and get the response
        try {
          const response = await fetch(`http://localhost:5080/api/abort-generation/${taskId}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Abort response:', data);
          
          // Call the onAbort callback with the server's response data
          if (onAbort && data.status === "success") {
            onAbort(data);
          }
        } catch (err) {
          console.error('Error aborting generation:', err);
          // Still call onAbort with an error
          if (onAbort) {
            onAbort({ status: "aborted", message: "Generation aborted with errors", total_generated: 0 });
          }
        }
      }
    };
    
    // Create and assign the EventSource for streaming
    controller.eventSource = new EventSource(
      `http://localhost:5080/api/stream-logos/${taskId}?company_name=${encodeURIComponent(companyName)}`
    );
    
    // Handle incoming messages
    controller.eventSource.onmessage = (event) => {
      // If controller is no longer active, ignore messages
      if (!controller.isActive) return;
      
      try {
        const data = JSON.parse(event.data);
        
        if (data.status === "success") {
          // Call the logo generated callback
          onLogoGenerated(data);
          
          // If this is the last logo, close the stream and call completion callback
          if (data.is_last) {
            controller.eventSource.close();
            controller.isActive = false;
            if (onComplete) onComplete();
          }
        } else if (data.status === "aborted") {
          // Handle aborted generation
          console.log("Logo generation was aborted by the server", data);
          controller.eventSource.close();
          controller.isActive = false;
          if (onAbort) onAbort(data);
        } else if (data.status === "error") {
          console.error('Error in logo generation:', data.message);
          controller.eventSource.close();
          controller.isActive = false;
          if (onError) onError(new Error(data.message));
        }
      } catch (error) {
        console.error('Error parsing stream data:', error);
        controller.eventSource.close();
        controller.isActive = false;
        if (onError) onError(error);
      }
    };
    
    // Handle errors
    controller.eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      controller.eventSource.close();
      controller.isActive = false;
      if (onError) onError(error);
    };
    
    return controller;
  }
  
  /**
   * Aborts an ongoing logo generation task
   * @param {string} taskId - The task ID to abort
   * @returns {Promise<Object>} - The server response
   */
  export async function abortGeneration(taskId) {
    try {
      const response = await fetch(`http://localhost:5080/api/abort-generation/${taskId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error aborting generation:', error);
      throw error;
    }
  }